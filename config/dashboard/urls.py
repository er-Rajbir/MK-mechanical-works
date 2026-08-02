from django.urls import path
from . import views

app_name = "dashboard"

urlpatterns = [

    # Authentication
    path("login/", views.dashboard_login, name="login"),
    path("logout/", views.dashboard_logout, name="logout"),

    # Dashboard Home
    path("", views.dashboard_home, name="home"),

    # Product Management
    path("products/", views.product_list, name="product_list"),
    path("products/add/", views.product_create, name="product_add"),
    path("products/<int:pk>/edit/", views.product_update, name="product_edit"),
    path("products/<int:pk>/delete/", views.product_delete, name="product_delete"),

    # Product Gallery
    path(
        "products/<int:pk>/gallery/",
        views.product_gallery,
        name="product_gallery",
    ),

    # Contact Queries
    path("contacts/", views.contact_list, name="contact_list"),

    # Profile
    path("profile/", views.profile, name="profile"),
    path(
    "contacts/<int:pk>/read/",
    views.mark_contact_read,
    name="contact_read",
),

path(
    "contacts/<int:pk>/unread/",
    views.mark_contact_unread,
    name="contact_unread",
),

path(
    "contacts/<int:pk>/delete/",
    views.contact_delete,
    name="contact_delete",
),
path(
    "contacts/export/excel/",
    views.export_contacts_excel,
    name="export_contacts_excel",
),
]