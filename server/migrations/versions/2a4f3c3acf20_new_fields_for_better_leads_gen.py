"""new fields for better leads gen

Revision ID: 2a4f3c3acf20
Revises: 0829b1d40272
Create Date: 2024-12-25 03:07:22.945107

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2a4f3c3acf20'
down_revision = '0829b1d40272'
branch_labels = None
depends_on = None


from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '2a4f3c3acf20'
down_revision = '0829b1d40272'
branch_labels = None
depends_on = None

def upgrade():
    # Create the enum type in Postgres
    user_role_enum = postgresql.ENUM('KAM', 'MANAGER', 'ADMIN', name='userrole')
    user_role_enum.create(op.get_bind(), checkfirst=True)

    # If your existing data has roles like 'KAM'/'Manager' or any inconsistent casing,
    # fix them so they match your new enum exactly. For example:
    op.execute("UPDATE users SET role='KAM' WHERE role ILIKE 'kam'")
    op.execute("UPDATE users SET role='MANAGER' WHERE role ILIKE 'manager'")
    op.execute("UPDATE users SET role='ADMIN' WHERE role ILIKE 'admin'")

    # Now run your existing commands to add columns / foreign keys, etc.
    # For example:
    with op.batch_alter_table('contacts', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('preferred_contact_method',
                      sa.Enum('PHONE', 'EMAIL', 'WHATSAPP', 'SMS',
                              name='preferredcontactmethod'),
                      nullable=True)
        )
        batch_op.add_column(sa.Column('time_zone', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=False))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=False))

    # ... same for interactions, restaurants ...

    # When altering 'users.role' to the new enum, add the USING clause:
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column(
            'role',
            existing_type=sa.VARCHAR(length=50),
            type_=sa.Enum('KAM', 'MANAGER', 'ADMIN', name='userrole'),
            existing_nullable=False,
            postgresql_using="role::userrole"   # <- critical!
        )


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('role',
               existing_type=sa.Enum('KAM', 'MANAGER', 'ADMIN', name='userrole'),
               type_=sa.VARCHAR(length=50),
               existing_nullable=False)

    with op.batch_alter_table('restaurants', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
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

    with op.batch_alter_table('contacts', schema=None) as batch_op:
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')
        batch_op.drop_column('time_zone')
        batch_op.drop_column('preferred_contact_method')

    # ### end Alembic commands ###