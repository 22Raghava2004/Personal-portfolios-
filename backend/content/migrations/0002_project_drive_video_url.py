from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="drive_video_url",
            field=models.URLField(
                blank=True,
                help_text="Google Drive share link. Set General access to Anyone with the link (Viewer).",
            ),
        ),
    ]
