from django.contrib import admin

from .models import AR, ARAdmin as ARAdminModel


class ARAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)


admin.site.register(AR, ARAdmin)
admin.site.register(ARAdminModel)
