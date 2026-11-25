from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Project, Skill, Post, AboutContent, SiteProfile
from .serializers import ProjectSerializer, SkillSerializer, PostSerializer, AboutSerializer, SiteProfileSerializer


class ModeListMixin:
    permission_classes = [AllowAny]

    def get_queryset(self):
        mode = self.request.query_params.get("mode", "creative")
        if mode not in ("creative", "developer"):
            mode = "creative"
        return self.model.objects.filter(mode=mode, is_published=True).order_by("sort_order", "-created_at")


class ProjectList(ModeListMixin, generics.ListAPIView):
    model = Project
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        limit = self.request.query_params.get("limit")
        if limit and limit.isdecimal():
            return queryset[:min(int(limit), 100)]
        return queryset


class SkillList(ModeListMixin, generics.ListAPIView):
    model = Skill
    serializer_class = SkillSerializer


class PostList(ModeListMixin, generics.ListAPIView):
    model = Post
    serializer_class = PostSerializer


class AboutDetail(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        mode = request.query_params.get("mode", "creative")
        if mode not in ("creative", "developer"):
            mode = "creative"
        obj = AboutContent.objects.filter(mode=mode).first()
        if not obj:
            return Response(None)
        return Response(AboutSerializer(obj, context={"request": request}).data)


class SiteProfileDetail(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        obj = SiteProfile.current()
        if not obj:
            return Response(None)
        return Response(SiteProfileSerializer(obj, context={"request": request}).data)
