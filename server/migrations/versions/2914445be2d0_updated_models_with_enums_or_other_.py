"""Updated models with enums or other changes

Revision ID: 2914445be2d0
Revises: 
Create Date: 2024-12-25 01:13:29.737065

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2914445be2d0'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        UPDATE restaurants
        SET status = UPPER(status)
        WHERE status IN ('new', 'contacted', 'converted', 'lost')
    """)

    with op.batch_alter_table('restaurants', schema=None) as batch_op:
        batch_op.alter_column(
            'status',
            existing_type=sa.VARCHAR(length=50),
            type_=sa.Enum('NEW', 'CONTACTED', 'CONVERTED', 'LOST', name='restaurantstatus'),
            nullable=False,
            postgresql_using="status::restaurantstatus"
        )

    op.execute("""
        UPDATE restaurants
        SET call_frequency = UPPER(call_frequency)
        WHERE call_frequency IN ('daily', 'weekly', 'monthly')
    """)

    with op.batch_alter_table('restaurants', schema=None) as batch_op:
        batch_op.alter_column(
            'call_frequency',
            existing_type=sa.VARCHAR(length=50),
            type_=sa.Enum('DAILY', 'WEEKLY', 'MONTHLY', name='callfrequency'),
            nullable=False,
            postgresql_using="call_frequency::callfrequency"
        )

    with op.batch_alter_table('contacts', schema=None) as batch_op:
        batch_op.alter_column('role',
                              existing_type=sa.VARCHAR(length=50),
                              type_=sa.String(length=100),
                              nullable=False)

    with op.batch_alter_table('interactions', schema=None) as batch_op:
        batch_op.alter_column(
            'type',
            existing_type=sa.VARCHAR(length=50),
            type_=sa.Enum('CALL', 'MEETING', 'EMAIL', 'SITE_VISIT', 'FOLLOW_UP', name='interactiontype'),
            nullable=False,
            postgresql_using="type::interactiontype"
        )


def downgrade():
    with op.batch_alter_table('restaurants', schema=None) as batch_op:
        batch_op.alter_column(
            'status',
            existing_type=sa.Enum('NEW', 'CONTACTED', 'CONVERTED', 'LOST', name='restaurantstatus'),
            type_=sa.VARCHAR(length=50),
            nullable=True
        )
        batch_op.alter_column(
            'call_frequency',
            existing_type=sa.Enum('DAILY', 'WEEKLY', 'MONTHLY', name='callfrequency'),
            type_=sa.VARCHAR(length=50),
            nullable=True
        )

    with op.batch_alter_table('interactions', schema=None) as batch_op:
        batch_op.alter_column(
            'type',
            existing_type=sa.Enum('CALL', 'MEETING', 'EMAIL', 'SITE_VISIT', 'FOLLOW_UP', name='interactiontype'),
            type_=sa.VARCHAR(length=50),
            nullable=True
        )

    with op.batch_alter_table('contacts', schema=None) as batch_op:
        batch_op.alter_column(
            'role',
            existing_type=sa.String(length=100),
            type_=sa.VARCHAR(length=50),
            nullable=True
        )
