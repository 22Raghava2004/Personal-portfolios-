from rest_framework import serializers
from .models import Project, Skill, Post, AboutContent, SiteProfile


class ProjectSerializer(serializers.ModelSerializer):
    media_url = serializers.SerializerMethodField()
    media_kind = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ("id", "mode", "title", "year", "description", "image", "video", "drive_video_url", "media_url", "media_kind", "project_url", "sort_order")

    def get_media_url(self, obj):
        if obj.mode == Project.CREATIVE and obj.drive_video_url:
            return obj.drive_embed_url
        field = obj.video if obj.mode == Project.CREATIVE and obj.video else obj.image
        request = self.context.get("request")
        if not field:
            return None
        url = field.url
        return request.build_absolute_uri(url) if request else url

    def get_media_kind(self, obj):
        if obj.mode == Project.CREATIVE and obj.drive_video_url:
            return "drive"
        return "video" if obj.mode == Project.CREATIVE and obj.video else "image"


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ("id", "mode", "name", "detail", "proficiency", "sort_order")


class PostSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ("id", "mode", "title", "category", "body", "cover_image", "cover_image_url", "published_on", "sort_order")

    def get_cover_image_url(self, obj):
        if not obj.cover_image:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(obj.cover_image.url) if request else obj.cover_image.url


class AboutSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = AboutContent
        fields = ("mode", "heading", "introduction", "description", "profile_image_url")

    def get_profile_image_url(self, obj):
        if not obj.profile_image:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(obj.profile_image.url) if request else obj.profile_image.url


class SiteProfileSerializer(serializers.ModelSerializer):
    day_video_url = serializers.SerializerMethodField()
    night_video_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteProfile
        fields = ("site_title", "contact_email", "location", "instagram_url", "linkedin_url", "github_url", "day_video_url", "night_video_url")

    def _url(self, field):
        if not field:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(field.url) if request else field.url

    def get_day_video_url(self, obj):
        return self._url(obj.day_background_video)

    def get_night_video_url(self, obj):
        return self._url(obj.night_background_video)
