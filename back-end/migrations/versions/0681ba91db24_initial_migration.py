"""Initial migration

Revision ID: 0681ba91db24
Revises: 
Create Date: 2024-09-25 13:56:21.661600

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0681ba91db24'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('car_categories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('car_brand', sa.String(length=255), nullable=False),
    sa.Column('type', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('drivers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('gender', sa.String(length=255), nullable=False),
    sa.Column('dob', sa.Date(), nullable=False),
    sa.Column('address', sa.String(length=255), nullable=False),
    sa.Column('phone_number', sa.String(length=255), nullable=False),
    sa.Column('license_number', sa.String(length=255), nullable=False),
    sa.Column('status', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('roles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('cars',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.Column('slug', sa.String(length=255), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('transmission', sa.String(length=255), nullable=False),
    sa.Column('fuel', sa.String(length=255), nullable=False),
    sa.Column('color', sa.String(length=255), nullable=False),
    sa.Column('plate_number', sa.String(length=255), nullable=False),
    sa.Column('capacity', sa.Integer(), nullable=False),
    sa.Column('registration_number', sa.Integer(), nullable=False),
    sa.Column('price', sa.DECIMAL(precision=10, scale=2), nullable=False),
    sa.Column('image', sa.String(length=255), nullable=False),
    sa.Column('status', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['car_categories.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('plate_number'),
    sa.UniqueConstraint('slug')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('role_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('address', sa.String(length=255), nullable=False),
    sa.Column('phone_number', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('car_maintenances',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('car_id', sa.Integer(), nullable=False),
    sa.Column('maintenance_date', sa.Date(), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=False),
    sa.Column('cost', sa.DECIMAL(precision=10, scale=2), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['car_id'], ['cars.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('car_id', sa.Integer(), nullable=False),
    sa.Column('driver_id', sa.Integer(), nullable=True),
    sa.Column('invoice', sa.String(length=255), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=False),
    sa.Column('end_date', sa.Date(), nullable=False),
    sa.Column('return_date', sa.Date(), nullable=True),
    sa.Column('rental_status', sa.String(length=255), nullable=False),
    sa.Column('payment_status', sa.String(length=255), nullable=False),
    sa.Column('payment_proof', sa.String(length=255), nullable=False),
    sa.Column('late_fee', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('total_cost', sa.DECIMAL(precision=10, scale=2), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['car_id'], ['cars.id'], ),
    sa.ForeignKeyConstraint(['driver_id'], ['drivers.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('invoice')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('transactions')
    op.drop_table('car_maintenances')
    op.drop_table('users')
    op.drop_table('cars')
    op.drop_table('roles')
    op.drop_table('drivers')
    op.drop_table('car_categories')
    # ### end Alembic commands ###