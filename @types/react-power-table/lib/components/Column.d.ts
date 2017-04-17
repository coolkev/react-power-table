/// <reference types="react" />
import * as React from 'react';
export declare const defaultHeaderComponent: React.ComponentClass<HeaderComponentProps<any>>;
export declare const defaultCellComponent: React.ComponentClass<CellProps<any>>;
export declare function transformColumn<T>(options: Column<T> | string, gridProps: GridProps<T>): TransformedColumn<T>;
