from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Custom User admin configuration
    """
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'created_at')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-created_at',)

    # Add the custom fields to the fieldsets
    fieldsets = UserAdmin.fieldsets + (
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    readonly_fields = ('created_at', 'updated_at')
    