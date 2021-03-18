from django.contrib import admin

from .models import AR


class ARAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)


admin.site.register(AR, ARAdmin)
