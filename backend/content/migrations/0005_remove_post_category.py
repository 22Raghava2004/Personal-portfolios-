from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0004_project_media_aspect_ratio"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="post",
            name="category",
        ),
    ]
