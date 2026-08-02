from django.contrib import admin

from .models import Category, Machine, MachineImage, Contact


class MachineImageInline(admin.TabularInline):
    model = MachineImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "created_at",
    )

    list_filter = (
        "category",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
    )

    inlines = [MachineImageInline]


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "email",
        "phone",
        "machine",
        "is_read",
        "created_at",
    )

    list_filter = (
        "is_read",
        "created_at",
    )

    search_fields = (
        "full_name",
        "email",
        "phone",
    )