from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0006_post_cover_image_drive_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="drive_image_url",
            field=models.URLField(
                blank=True,
                help_text="Optional Google Drive image link. Set General access to Anyone with the link (Viewer).",
            ),
        ),
    ]
