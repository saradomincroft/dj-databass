"""Initial migration.

Revision ID: 738a06d957ae
Revises: 
Create Date: 2024-07-22 19:59:38.389811

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '738a06d957ae'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('is_asmin', sa.Boolean(), nullable=True),
    sa.Column('_hashed_password', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    # ### end Alembic commands ###
