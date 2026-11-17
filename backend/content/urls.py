from django.urls import path
from .views import ProjectList, SkillList, PostList, AboutDetail, SiteProfileDetail

urlpatterns = [
    path("projects/", ProjectList.as_view(), name="projects"),
    path("skills/", SkillList.as_view(), name="skills"),
    path("posts/", PostList.as_view(), name="posts"),
    path("about/", AboutDetail.as_view(), name="about"),
    path("site/", SiteProfileDetail.as_view(), name="site-profile"),
]
