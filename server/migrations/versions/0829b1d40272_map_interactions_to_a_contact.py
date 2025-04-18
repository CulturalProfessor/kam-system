"""map interactions to a contact

Revision ID: 0829b1d40272
Revises: 2914445be2d0
Create Date: 2024-12-25 02:19:19.677018

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0829b1d40272'
down_revision = '2914445be2d0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('interactions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('contact_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(None, 'contacts', ['contact_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('interactions', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('contact_id')

    # ### end Alembic commands ###
