from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0003_remove_project_category"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="media_aspect_ratio",
            field=models.CharField(
                choices=[
                    ("16:9", "Landscape video (16:9)"),
                    ("9:16", "Portrait / Shorts video (9:16)"),
                ],
                default="16:9",
                help_text="Choose the shape that matches this project's media.",
                max_length=5,
            ),
        ),
    ]
