from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("content.urls")),
    path("api/health/", lambda request: JsonResponse({"status": "ok"}), name="health"),
]
if (settings.BASE_DIR / "templates" / "dist" / "index.html").exists():
    urlpatterns.append(
        re_path(r"^(?!api/|admin/|media/|static/).*$", TemplateView.as_view(template_name="index.html"))
    )
else:
    urlpatterns.append(path("", lambda request: JsonResponse({"status": "ok", "service": "portfolio-api"})))

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
