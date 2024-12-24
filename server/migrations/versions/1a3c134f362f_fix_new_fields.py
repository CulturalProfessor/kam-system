"""
fix new fields

Revision ID: 1a3c134f362f
Revises: 2a4f3c3acf20
Create Date: 2024-12-25 03:22:41.720906
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import func

# revision identifiers, used by Alembic.
revision = '1a3c134f362f'
down_revision = '2a4f3c3acf20'
branch_labels = None
depends_on = None

def upgrade():
    # You can set a server_default if you need a guaranteed value for existing rows.
    # For example, server_default=sa.func.now() (requires from sqlalchemy.sql import func)

    with op.batch_alter_table('interactions', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                'outcome',
                sa.Enum('SUCCESSFUL', 'NEEDS_FOLLOW_UP', 'NO_RESPONSE', 'CANCELLED', name='interactionoutcome'),
                nullable=True
            )
        )
        batch_op.add_column(sa.Column('duration_minutes', sa.Integer(), nullable=True))

        # If you want these columns NOT NULL, consider providing a server_default:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')))

    with op.batch_alter_table('restaurants', schema=None) as batch_op:
        batch_op.add_column(sa.Column('revenue', sa.Numeric(precision=12, scale=2), nullable=True))
        batch_op.add_column(sa.Column('notes', sa.Text(), nullable=True))

        # Same approach to handle not-null columns if needed
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')))

        batch_op.add_column(sa.Column('assigned_kam_id', sa.Integer(), nullable=True))
        # Name the foreign key constraint instead of using None
        batch_op.create_foreign_key(
            "fk_restaurants_assigned_kam_id",  # Chosen constraint name
            'users',
            ['assigned_kam_id'],
            ['id']
        )

def downgrade():
    # Reverse each step in the proper order
    with op.batch_alter_table('restaurants', schema=None) as batch_op:
        # Drop the named FK constraint
        batch_op.drop_constraint("fk_restaurants_assigned_kam_id", type_='foreignkey')
        batch_op.drop_column('assigned_kam_id')
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')
        batch_op.drop_column('notes')
        batch_op.drop_column('revenue')

    with op.batch_alter_table('interactions', schema=None) as batch_op:
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')
        batch_op.drop_column('duration_minutes')
        batch_op.drop_column('outcome')
