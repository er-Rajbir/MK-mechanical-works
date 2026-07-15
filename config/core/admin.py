from django.contrib import admin
from .models import Category, Machine

admin.site.register(Category)
admin.site.register(Machine)

from django.contrib import admin
from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):

    list_display = (
        "full_name",
        "company_name",
        "phone",
        "email",
        "machine",
        "created_at"
    )

    search_fields = (
        "full_name",
        "email",
        "phone"
    )

    list_filter = (
        "machine",
        "created_at"
    )