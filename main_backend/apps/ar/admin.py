from django.contrib import admin

from .models import AR, ARAdmin as ARAdminModel


class ARAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'image')

    def has_add_permission(self, request):
        return False


admin.site.register(AR, ARAdmin)
admin.site.register(ARAdminModel)
