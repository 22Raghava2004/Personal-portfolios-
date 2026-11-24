from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0002_project_drive_video_url"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="project",
            name="category",
        ),
    ]
