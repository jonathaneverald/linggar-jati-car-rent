"""change nullable on payment_proof to true

Revision ID: 1871d8124290
Revises: 0681ba91db24
Create Date: 2024-10-19 18:19:42.057080

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '1871d8124290'
down_revision = '0681ba91db24'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('transactions', schema=None) as batch_op:
        batch_op.alter_column('payment_proof',
               existing_type=mysql.VARCHAR(length=255),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('transactions', schema=None) as batch_op:
        batch_op.alter_column('payment_proof',
               existing_type=mysql.VARCHAR(length=255),
               nullable=False)

    # ### end Alembic commands ###