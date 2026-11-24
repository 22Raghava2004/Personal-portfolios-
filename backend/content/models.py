from django.core.exceptions import ValidationError
from django.db import models
from urllib.parse import parse_qs, urlsplit


class PublishedModel(models.Model):
    is_published = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ("sort_order", "-created_at")


class Project(PublishedModel):
    CREATIVE = "creative"
    DEVELOPER = "developer"
    MODE_CHOICES = [(CREATIVE, "Creative"), (DEVELOPER, "Developer")]
    mode = models.CharField(max_length=12, choices=MODE_CHOICES)
    title = models.CharField(max_length=160)
    category = models.CharField(max_length=80, blank=True)
    year = models.CharField(max_length=12, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="projects/images/", blank=True)
    video = models.FileField(upload_to="projects/videos/", blank=True)
    drive_video_url = models.URLField(
        blank=True,
        help_text="Google Drive share link. Set General access to Anyone with the link (Viewer).",
    )
    project_url = models.URLField(blank=True)

    class Meta(PublishedModel.Meta):
        indexes = [models.Index(fields=["mode", "is_published", "sort_order"])]

    def clean(self):
        super().clean()
        if self.drive_video_url and not self.get_drive_file_id():
            raise ValidationError({
                "drive_video_url": "Enter a Google Drive file link such as https://drive.google.com/file/d/FILE_ID/view"
            })
        if self.mode == self.DEVELOPER:
            if not self.image:
                raise ValidationError({"image": "Developer projects require one image."})
            if self.video or self.drive_video_url:
                raise ValidationError("Developer projects use an image only.")
        elif self.mode == self.CREATIVE:
            media_count = sum(bool(value) for value in (self.image, self.video, self.drive_video_url))
            if media_count != 1:
                raise ValidationError("Creative projects must have exactly one image, uploaded video, or Google Drive video link.")

    def get_drive_file_id(self):
        if not self.drive_video_url:
            return None
        parts = urlsplit(self.drive_video_url)
        if parts.scheme != "https" or parts.hostname not in {"drive.google.com", "www.drive.google.com"}:
            return None
        path_parts = parts.path.strip("/").split("/")
        if len(path_parts) >= 3 and path_parts[0] == "file" and path_parts[1] == "d":
            return path_parts[2]
        return parse_qs(parts.query).get("id", [None])[0]

    @property
    def drive_embed_url(self):
        file_id = self.get_drive_file_id()
        return f"https://drive.google.com/file/d/{file_id}/preview" if file_id else None

    def __str__(self):
        return f"[{self.mode}] {self.title}"


class Skill(PublishedModel):
    mode = models.CharField(max_length=12, choices=Project.MODE_CHOICES)
    name = models.CharField(max_length=100)
    detail = models.CharField(max_length=240, blank=True)
    proficiency = models.PositiveSmallIntegerField(null=True, blank=True, help_text="Optional percentage from 1 to 100")

    def clean(self):
        super().clean()
        if self.proficiency is not None and not 1 <= self.proficiency <= 100:
            raise ValidationError({"proficiency": "Enter a value from 1 to 100."})

    def __str__(self):
        return f"[{self.mode}] {self.name}"


class Post(PublishedModel):
    mode = models.CharField(max_length=12, choices=Project.MODE_CHOICES)
    title = models.CharField(max_length=180)
    category = models.CharField(max_length=80, blank=True)
    body = models.TextField()
    cover_image = models.ImageField(upload_to="posts/", blank=True)
    published_on = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"[{self.mode}] {self.title}"


class AboutContent(models.Model):
    mode = models.CharField(max_length=12, choices=Project.MODE_CHOICES, unique=True)
    heading = models.CharField(max_length=180, blank=True)
    introduction = models.TextField(blank=True)
    description = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to="about/", blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"About — {self.mode}"


class SiteProfile(models.Model):
    site_title = models.CharField(max_length=120, default="Raghava")
    contact_email = models.EmailField(blank=True)
    location = models.CharField(max_length=120, blank=True)
    instagram_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    day_background_video = models.FileField(upload_to="backgrounds/", blank=True)
    night_background_video = models.FileField(upload_to="backgrounds/", blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.site_title

    @classmethod
    def current(cls):
        obj = cls.objects.first()
        return obj
