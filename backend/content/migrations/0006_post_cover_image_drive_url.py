from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0005_remove_post_category"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="cover_image_drive_url",
            field=models.URLField(
                blank=True,
                help_text="Optional Google Drive image link. Set General access to Anyone with the link (Viewer).",
            ),
        ),
    ]
