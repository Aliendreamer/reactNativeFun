import React from 'react';
import { DataTable, TextInput } from 'react-native-paper';
import { SymbolFields } from '../helpers/constants';

function TableRowsRenderer({ style, index, object, updateValue }) {
    return (
        <DataTable.Row>
            <DataTable.Cell style={style}>
                <TextInput
                    value={object.symbol}
                    style={style}
                    onChangeText={v =>
                        updateValue(index, SymbolFields.SYMBOL, v)
                    }
                />
            </DataTable.Cell>
            <DataTable.Cell style={style}>
                <TextInput
                    value={object.pronounce}
                    style={style}
                    onChangeText={v =>
                        updateValue(index, SymbolFields.PRONOUNCE, v)
                    }
                />
            </DataTable.Cell>
            <DataTable.Cell style={style}>
                <TextInput
                    value={object.hints}
                    style={style}
                    onChangeText={v =>
                        updateValue(index, SymbolFields.HINTS, v)
                    }
                />
            </DataTable.Cell>
        </DataTable.Row>
    );
}
export default TableRowsRenderer;
