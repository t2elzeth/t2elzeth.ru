# Generated by Django 3.2.2 on 2021-05-09 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ar', '0004_auto_20210403_0816'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ar',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='aradmin',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
