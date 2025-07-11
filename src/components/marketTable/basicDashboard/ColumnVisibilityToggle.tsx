import React from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { Column } from '../../../models/dashboards/Column';


interface ColumnVisibilityToggleProps<T> {
  columns: Column<T>[];
  visibleColumns: string[];
  onToggle: (key: string) => void;
}

const ColumnVisibilityToggle = <T,>({
  columns,
  visibleColumns,
  onToggle,
}: ColumnVisibilityToggleProps<T>) => {
  return (
    <div className="flex items-center justify-center mb-4 px-4">
      <FormGroup row>
        {columns.map((column) => (
          <FormControlLabel
            key={column.key as string}
            control={
              <Checkbox
                checked={visibleColumns.includes(column.key as string)}
                onChange={() => onToggle(column.key as string)}
                color="primary"
              />
            }
            label={column.label}
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default ColumnVisibilityToggle;
