# Generated by Django 3.1.7 on 2021-04-01 14:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ar', '0003_auto_20210322_1509'),
    ]

    operations = [
        migrations.AddField(
            model_name='ar',
            name='scale',
            field=models.PositiveIntegerField(default=360),
        ),
    ]
