"""
Backend API pour Atlas Lions Apparel
Gestion des commandes de maillots personnalisés
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import databases
import sqlalchemy
from sqlalchemy import MetaData, Table, Column, Integer, String, Float, Boolean, DateTime, Text, Numeric
import base64
import os
from pathlib import Path
from dotenv import load_dotenv

# Charger le fichier .env
load_dotenv()

from dotenv import load_dotenv

# Charger le fichier .env
load_dotenv()

# ========================================
# CONFIGURATION
# ========================================

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/atlas_lions")
database = databases.Database(DATABASE_URL)

app = FastAPI(
    title="Atlas Lions Apparel API",
    description="API de gestion des commandes de maillots CAN 2025",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production: mettre les domaines spécifiques
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dossier pour les images
IMAGES_DIR = Path("static/images/previews")
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Servir les fichiers statiques
app.mount("/static", StaticFiles(directory="static"), name="static")

# ========================================
# MODÈLES DE DONNÉES
# ========================================

class PersonalizationName(BaseModel):
    enabled: bool
    text: str
    font: str
    color: str
    position: dict

class PersonalizationNumber(BaseModel):
    enabled: bool
    text: str
    font: str
    color: str
    position: dict

class PersonalizationSlogan(BaseModel):
    enabled: bool
    text: str
    font: str
    color: str
    size: str
    position: dict

class PersonalizationData(BaseModel):
    id: str
    timestamp: int
    jerseyColor: str
    name: PersonalizationName
    number: PersonalizationNumber
    slogan: PersonalizationSlogan
    selectedPosition: str
    previewImage: Optional[str] = None

class CustomerInfo(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postalCode: Optional[str] = None

class OrderCreate(BaseModel):
    personalizationData: PersonalizationData
    customerInfo: CustomerInfo

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    customerName: Optional[str] = None
    customerPhone: Optional[str] = None
    customerAddress: Optional[str] = None

# ========================================
# BASE DE DONNÉES
# ========================================

metadata = MetaData()

orders = Table(
    "orders",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("order_number", String(50), unique=True, nullable=False),
    Column("personalization_id", String(100), unique=True),
    
    # Client
    Column("customer_name", String(100)),
    Column("customer_phone", String(20)),
    Column("customer_address", Text),
    Column("customer_city", String(100)),
    Column("customer_postal_code", String(20)),
    
    # Produit
    Column("jersey_color", String(20)),
    
    # Personnalisation Nom
    Column("name_enabled", Boolean, default=False),
    Column("name_text", String(50)),
    Column("name_font", String(50)),
    Column("name_color", String(50)),
    Column("name_position_x", Float),
    Column("name_position_y", Float),
    
    # Personnalisation Numéro
    Column("number_enabled", Boolean, default=False),
    Column("number_text", String(10)),
    Column("number_font", String(50)),
    Column("number_color", String(50)),
    Column("number_position_x", Float),
    Column("number_position_y", Float),
    
    # Personnalisation Slogan
    Column("slogan_enabled", Boolean, default=False),
    Column("slogan_text", String(100)),
    Column("slogan_font", String(50)),
    Column("slogan_color", String(50)),
    Column("slogan_size", String(20)),
    Column("slogan_position_x", Float),
    Column("slogan_position_y", Float),
    
    # Autres
    Column("selected_position", String(20)),
    Column("preview_image_url", Text),
    
    # Commande
    Column("total_price", Numeric(10, 2)),
    Column("status", String(50), default="pending"),
    Column("notes", Text),
    
    # Dates
    Column("created_at", DateTime, default=datetime.now),
    Column("updated_at", DateTime, default=datetime.now, onupdate=datetime.now),
)

# ========================================
# CONNEXION BASE DE DONNÉES
# ========================================

@app.on_event("startup")
async def startup():
    await database.connect()
    print("✅ Connexion à la base de données établie")

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
    print("❌ Connexion à la base de données fermée")

# ========================================
# FONCTIONS UTILITAIRES
# ========================================

def save_preview_image(personalization_id: str, base64_data: str) -> str:
    """
    Sauvegarde l'image de prévisualisation et retourne l'URL
    """
    try:
        # Extraire les données base64
        if ',' in base64_data:
            image_data = base64_data.split(',')[1]
        else:
            image_data = base64_data
        
        # Décoder
        image_bytes = base64.b64decode(image_data)
        
        # Nom du fichier
        filename = f"{personalization_id}.png"
        filepath = IMAGES_DIR / filename
        
        # Sauvegarder
        with open(filepath, "wb") as f:
            f.write(image_bytes)
        
        # Retourner l'URL
        return f"/static/images/previews/{filename}"
    
    except Exception as e:
        print(f"Erreur sauvegarde image: {e}")
        return None

def calculate_price(personalization: PersonalizationData) -> float:
    """
    Calcule le prix total de la commande
    """
    base_price = 180.0
    
    if personalization.name.enabled and personalization.name.text:
        base_price += 30.0
    
    if personalization.number.enabled and personalization.number.text:
        base_price += 20.0
    
    if personalization.slogan.enabled and personalization.slogan.text:
        base_price += 50.0
    
    return base_price

async def generate_order_number() -> str:
    """
    Génère un numéro de commande unique
    """
    query = "SELECT COUNT(*) FROM orders"
    count = await database.fetch_val(query)
    return f"CMD-{count + 1:04d}"

# ========================================
# ENDPOINTS API
# ========================================

@app.get("/")
async def root():
    """
    Page d'accueil de l'API
    """
    return {
        "message": "Atlas Lions Apparel API",
        "version": "1.0.0",
        "endpoints": {
            "orders": "/api/orders",
            "admin": "/api/admin/orders",
            "stats": "/api/admin/stats"
        }
    }

@app.get("/health")
async def health_check():
    """
    Vérification de santé de l'API
    """
    try:
        await database.fetch_val("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

# ========================================
# ENDPOINT 1 : Créer une commande
# ========================================

@app.post("/api/orders")
async def create_order(order: OrderCreate):
    """
    Crée une nouvelle commande
    
    Le frontend envoie automatiquement les données ici après que
    le client ait personnalisé son maillot et cliqué sur "Commander"
    """
    try:
        p = order.personalizationData
        c = order.customerInfo
        
        # Générer le numéro de commande
        order_number = await generate_order_number()
        
        # Calculer le prix
        total_price = calculate_price(p)
        
        # Sauvegarder l'image
        preview_url = None
        if p.previewImage:
            preview_url = save_preview_image(p.id, p.previewImage)
        
        # Préparer les données
        values = {
            "order_number": order_number,
            "personalization_id": p.id,
            "customer_name": c.name or "",
            "customer_phone": c.phone or "",
            "customer_address": c.address or "",
            "customer_city": c.city or "",
            "customer_postal_code": c.postalCode or "",
            "jersey_color": p.jerseyColor,
            "name_enabled": p.name.enabled,
            "name_text": p.name.text,
            "name_font": p.name.font,
            "name_color": p.name.color,
            "name_position_x": p.name.position.get('x', 50),
            "name_position_y": p.name.position.get('y', 35),
            "number_enabled": p.number.enabled,
            "number_text": p.number.text,
            "number_font": p.number.font,
            "number_color": p.number.color,
            "number_position_x": p.number.position.get('x', 50),
            "number_position_y": p.number.position.get('y', 50),
            "slogan_enabled": p.slogan.enabled,
            "slogan_text": p.slogan.text,
            "slogan_font": p.slogan.font,
            "slogan_color": p.slogan.color,
            "slogan_size": p.slogan.size,
            "slogan_position_x": p.slogan.position.get('x', 50),
            "slogan_position_y": p.slogan.position.get('y', 65),
            "selected_position": p.selectedPosition,
            "preview_image_url": preview_url,
            "total_price": total_price,
            "status": "pending"
        }
        
        # Insérer en base de données
        query = orders.insert().values(**values)
        order_id = await database.execute(query)
        
        print(f"✅ Commande créée : {order_number} - {c.name or 'Client'} - {total_price} DH")
        
        return {
            "success": True,
            "orderId": order_id,
            "orderNumber": order_number,
            "totalPrice": float(total_price),
            "previewUrl": preview_url,
            "message": "Commande créée avec succès"
        }
        
    except Exception as e:
        print(f"❌ Erreur création commande : {e}")
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")

# ========================================
# ENDPOINT 2 : Liste des commandes (Admin)
# ========================================

@app.get("/api/admin/orders")
async def get_orders(
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    sortBy: str = "created_at",
    order: str = "desc"
):
    """
    Récupère la liste des commandes avec filtres et pagination
    
    Paramètres:
    - status: Filtrer par statut (pending, confirmed, in_production, shipped, delivered)
    - search: Recherche par nom, téléphone, numéro de commande
    - limit: Nombre de résultats par page (max 100)
    - offset: Décalage pour la pagination
    - sortBy: Champ de tri (created_at, order_number, total_price)
    - order: Ordre de tri (asc, desc)
    """
    try:
        # Construction de la requête de base
        query = "SELECT * FROM orders WHERE 1=1"
        values = {}
        
        # Filtre par statut
        if status:
            query += " AND status = :status"
            values["status"] = status
        
        # Recherche
        if search:
            query += """ AND (
                customer_name ILIKE :search OR 
                customer_phone ILIKE :search OR 
                order_number ILIKE :search OR
                name_text ILIKE :search OR
                number_text ILIKE :search
            )"""
            values["search"] = f"%{search}%"
        
        # Compter le total
        count_query = f"SELECT COUNT(*) FROM ({query}) as count_query"
        total = await database.fetch_val(count_query, values)
        
        # Tri
        allowed_sort = ["created_at", "order_number", "total_price", "updated_at"]
        if sortBy not in allowed_sort:
            sortBy = "created_at"
        
        order_dir = "DESC" if order.lower() == "desc" else "ASC"
        query += f" ORDER BY {sortBy} {order_dir}"
        
        # Pagination
        limit = min(limit, 100)  # Max 100 résultats
        query += " LIMIT :limit OFFSET :offset"
        values["limit"] = limit
        values["offset"] = offset
        
        # Exécuter la requête
        orders_list = await database.fetch_all(query, values)
        
        return {
            "success": True,
            "orders": [dict(order) for order in orders_list],
            "pagination": {
                "total": total,
                "limit": limit,
                "offset": offset,
                "pages": (total + limit - 1) // limit
            }
        }
        
    except Exception as e:
        print(f"❌ Erreur récupération commandes : {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========================================
# ENDPOINT 3 : Détail d'une commande
# ========================================

@app.get("/api/admin/orders/{order_id}")
async def get_order_detail(order_id: int):
    """
    Récupère le détail complet d'une commande
    """
    try:
        query = "SELECT * FROM orders WHERE id = :order_id"
        order = await database.fetch_one(query, {"order_id": order_id})
        
        if not order:
            raise HTTPException(status_code=404, detail="Commande non trouvée")
        
        return {
            "success": True,
            "order": dict(order)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Erreur récupération commande : {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========================================
# ENDPOINT 4 : Mettre à jour une commande
# ========================================

@app.put("/api/admin/orders/{order_id}")
async def update_order(order_id: int, update: OrderUpdate):
    """
    Met à jour une commande (statut, notes, infos client)
    """
    try:
        # Vérifier que la commande existe
        query = "SELECT id FROM orders WHERE id = :order_id"
        exists = await database.fetch_one(query, {"order_id": order_id})
        
        if not exists:
            raise HTTPException(status_code=404, detail="Commande non trouvée")
        
        # Construire la requête de mise à jour
        updates = []
        values = {"order_id": order_id}
        
        if update.status is not None:
            updates.append("status = :status")
            values["status"] = update.status
        
        if update.notes is not None:
            updates.append("notes = :notes")
            values["notes"] = update.notes
        
        if update.customerName is not None:
            updates.append("customer_name = :customer_name")
            values["customer_name"] = update.customerName
        
        if update.customerPhone is not None:
            updates.append("customer_phone = :customer_phone")
            values["customer_phone"] = update.customerPhone
        
        if update.customerAddress is not None:
            updates.append("customer_address = :customer_address")
            values["customer_address"] = update.customerAddress
        
        if not updates:
            raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
        
        updates.append("updated_at = NOW()")
        
        query = f"UPDATE orders SET {', '.join(updates)} WHERE id = :order_id"
        await database.execute(query, values)
        
        print(f"✅ Commande #{order_id} mise à jour")
        
        return {
            "success": True,
            "message": "Commande mise à jour avec succès"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Erreur mise à jour commande : {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========================================
# ENDPOINT 5 : Supprimer une commande
# ========================================

@app.delete("/api/admin/orders/{order_id}")
async def delete_order(order_id: int):
    """
    Supprime une commande
    """
    try:
        query = "DELETE FROM orders WHERE id = :order_id"
        result = await database.execute(query, {"order_id": order_id})
        
        if result == 0:
            raise HTTPException(status_code=404, detail="Commande non trouvée")
        
        print(f"✅ Commande #{order_id} supprimée")
        
        return {
            "success": True,
            "message": "Commande supprimée avec succès"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Erreur suppression commande : {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========================================
# ENDPOINT 6 : Statistiques (Admin)
# ========================================

@app.get("/api/admin/stats")
async def get_stats(period: str = "today"):
    """
    Récupère les statistiques du dashboard
    
    Paramètres:
    - period: today, week, month, year, all
    """
    try:
        stats = {}
        
        # Définir la période
        if period == "today":
            date_filter = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            query_date = "created_at >= :date_filter"
        elif period == "week":
            date_filter = datetime.now() - timedelta(days=7)
            query_date = "created_at >= :date_filter"
        elif period == "month":
            date_filter = datetime.now() - timedelta(days=30)
            query_date = "created_at >= :date_filter"
        elif period == "year":
            date_filter = datetime.now() - timedelta(days=365)
            query_date = "created_at >= :date_filter"
        else:  # all
            date_filter = None
            query_date = "1=1"
        
        values = {"date_filter": date_filter} if date_filter else {}
        
        # Nombre de commandes
        query = f"SELECT COUNT(*) FROM orders WHERE {query_date}"
        stats['total_orders'] = await database.fetch_val(query, values)
        
        # Chiffre d'affaires
        query = f"SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE {query_date}"
        stats['total_revenue'] = float(await database.fetch_val(query, values))
        
        # Commandes par statut
        query = f"""
            SELECT status, COUNT(*) as count 
            FROM orders 
            WHERE {query_date}
            GROUP BY status
        """
        status_counts = await database.fetch_all(query, values)
        stats['by_status'] = {row['status']: row['count'] for row in status_counts}
        
        # En cours (pending + confirmed + in_production)
        stats['in_progress'] = (
            stats['by_status'].get('pending', 0) +
            stats['by_status'].get('confirmed', 0) +
            stats['by_status'].get('in_production', 0)
        )
        
        # Livrées
        stats['delivered'] = stats['by_status'].get('delivered', 0)
        
        # Expédiées
        stats['shipped'] = stats['by_status'].get('shipped', 0)
        
        # Panier moyen
        if stats['total_orders'] > 0:
            stats['average_order'] = stats['total_revenue'] / stats['total_orders']
        else:
            stats['average_order'] = 0
        
        # Popularité des couleurs
        query = f"""
            SELECT jersey_color, COUNT(*) as count 
            FROM orders 
            WHERE {query_date}
            GROUP BY jersey_color
        """
        color_counts = await database.fetch_all(query, values)
        stats['by_color'] = {row['jersey_color']: row['count'] for row in color_counts}
        
        return {
            "success": True,
            "period": period,
            "stats": stats
        }
        
    except Exception as e:
        print(f"❌ Erreur récupération stats : {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========================================
# ENDPOINT 7 : Statistiques avancées
# ========================================

@app.get("/api/admin/stats/advanced")
async def get_advanced_stats():
    """
    Statistiques avancées pour le dashboard
    """
    try:
        stats = {}
        
        # Commandes par jour (7 derniers jours)
        query = """
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count,
                SUM(total_price) as revenue
            FROM orders
            WHERE created_at >= NOW() - INTERVAL '7 days'
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        """
        daily_stats = await database.fetch_all(query)
        stats['daily'] = [
            {
                "date": str(row['date']),
                "orders": row['count'],
                "revenue": float(row['revenue'])
            }
            for row in daily_stats
        ]
        
        # Top clients (par nombre de commandes)
        query = """
            SELECT 
                customer_name,
                customer_phone,
                COUNT(*) as order_count,
                SUM(total_price) as total_spent
            FROM orders
            WHERE customer_name IS NOT NULL AND customer_name != ''
            GROUP BY customer_name, customer_phone
            ORDER BY order_count DESC
            LIMIT 10
        """
        top_customers = await database.fetch_all(query)
        stats['top_customers'] = [
            {
                "name": row['customer_name'],
                "phone": row['customer_phone'],
                "orders": row['order_count'],
                "totalSpent": float(row['total_spent'])
            }
            for row in top_customers
        ]
        
        # Personnalisations populaires
        query = """
            SELECT 
                COUNT(CASE WHEN name_enabled THEN 1 END) as with_name,
                COUNT(CASE WHEN number_enabled THEN 1 END) as with_number,
                COUNT(CASE WHEN slogan_enabled THEN 1 END) as with_slogan
            FROM orders
        """
        perso_stats = await database.fetch_one(query)
        stats['personalization'] = dict(perso_stats)
        
        return {
            "success": True,
            "stats": stats
        }
        
    except Exception as e:
        print(f"❌ Erreur stats avancées : {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========================================
# ENDPOINT 8 : Recherche rapide
# ========================================

@app.get("/api/admin/search")
async def quick_search(q: str, limit: int = 10):
    """
    Recherche rapide dans les commandes
    """
    try:
        query = """
            SELECT id, order_number, customer_name, customer_phone, total_price, status
            FROM orders
            WHERE 
                customer_name ILIKE :search OR
                customer_phone ILIKE :search OR
                order_number ILIKE :search
            ORDER BY created_at DESC
            LIMIT :limit
        """
        
        results = await database.fetch_all(
            query,
            {"search": f"%{q}%", "limit": limit}
        )
        
        return {
            "success": True,
            "results": [dict(r) for r in results]
        }
        
    except Exception as e:
        print(f"❌ Erreur recherche : {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========================================
# LANCER LE SERVEUR
# ========================================

if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Démarrage du serveur Atlas Lions Apparel API")
    print("📍 URL: http://localhost:8000")
    print("📖 Documentation: http://localhost:8000/docs")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True  # Auto-reload en développement
    )
