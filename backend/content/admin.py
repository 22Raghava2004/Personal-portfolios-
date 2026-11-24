from django.contrib import admin
from .models import Project, Skill, Post, AboutContent, SiteProfile


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "mode", "sort_order", "is_published")
    list_filter = ("mode", "is_published")
    search_fields = ("title", "description")
    ordering = ("mode", "sort_order", "-created_at")


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "mode", "proficiency", "sort_order", "is_published")
    list_filter = ("mode", "is_published")
    search_fields = ("name", "detail")


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "mode", "category", "published_on", "is_published")
    list_filter = ("mode", "is_published", "category")
    search_fields = ("title", "body")


@admin.register(AboutContent)
class AboutAdmin(admin.ModelAdmin):
    list_display = ("mode", "heading", "updated_at")


@admin.register(SiteProfile)
class SiteProfileAdmin(admin.ModelAdmin):
    list_display = ("site_title", "contact_email", "updated_at")

    def has_add_permission(self, request):
        return not SiteProfile.objects.exists()
