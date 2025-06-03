-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    version BIGINT NOT NULL DEFAULT 1,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_by VARCHAR(255) NOT NULL,
    updated_by VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);
CREATE INDEX IF NOT EXISTS idx_items_updated_at ON items(updated_at);
CREATE INDEX IF NOT EXISTS idx_items_is_deleted ON items(is_deleted);
CREATE INDEX IF NOT EXISTS idx_items_created_by ON items(created_by);
CREATE INDEX IF NOT EXISTS idx_items_tags ON items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_items_metadata ON items USING GIN(metadata);

-- Add comments
COMMENT ON TABLE items IS 'Stores marketplace items with versioning and soft delete support';
COMMENT ON COLUMN items.id IS 'Unique identifier for the item';
COMMENT ON COLUMN items.name IS 'Name of the item';
COMMENT ON COLUMN items.description IS 'Detailed description of the item';
COMMENT ON COLUMN items.price IS 'Price of the item with 2 decimal places';
COMMENT ON COLUMN items.tags IS 'Array of tags associated with the item';
COMMENT ON COLUMN items.created_at IS 'Unix timestamp when the item was created';
COMMENT ON COLUMN items.updated_at IS 'Unix timestamp when the item was last updated';
COMMENT ON COLUMN items.version IS 'Version number for optimistic locking';
COMMENT ON COLUMN items.is_deleted IS 'Soft delete flag';
COMMENT ON COLUMN items.created_by IS 'User who created the item';
COMMENT ON COLUMN items.updated_by IS 'User who last updated the item';
COMMENT ON COLUMN items.metadata IS 'Additional flexible metadata as JSON'; 