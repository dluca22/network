# Generated by Django 4.1.1 on 2022-10-27 11:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0011_alter_history_post_alter_post_text'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Comment',
        ),
    ]
