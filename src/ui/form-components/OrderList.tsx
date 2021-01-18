import React, { FC, ReactNode } from 'react';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import List, { ListProps } from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

export enum ReOrderDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

type OrderListDataItemDataProp = {
  [key: string]: unknown;
};

export type OrderListDataItem = {
  id: ID;
  value: string;
  label?: string;
  data?: OrderListDataItemDataProp;
};

export type OrderListData = Array<OrderListDataItem>;

type OrderListBaseProps = Pick<ListProps, Exclude<keyof ListProps, 'onChange'>>;

interface OrderListProps extends OrderListBaseProps {
  data: OrderListData;
  children: (
    id: ID,
    value: string,
    i: number,
    attrs: OrderListDataItem
  ) => ReactNode;
  onMove: (
    e: React.MouseEvent<HTMLButtonElement> | null,
    i: number,
    nextIndex: number,
    data?: OrderListDataItem
  ) => void;
  onDelete: (
    e: React.MouseEvent<HTMLButtonElement> | null,
    i: number,
    data?: OrderListDataItem
  ) => void;
  // onChange?: ActionHandler; // override default onChange
}

interface StyleProps {
  numberOfItems: number;
}

const LIST_ITEM_HEIGHT = 82;

const useStyles = makeStyles((theme) =>
  createStyles({
    list: (props: StyleProps) => ({
      height: `${props.numberOfItems * LIST_ITEM_HEIGHT}px`,
    }),
    listItem: {
      display: 'flex',
      flexFlow: 'row',
      padding: '0',
      height: `${theme.spacing(7)}px`,
      // marginBottom: '1rem',
    },
    orderItems: {
      flexShrink: 0,
      flexGrow: 0,
      display: 'flex',
      flexFlow: 'column',
      paddingRight: theme.spacing(1),
    },
    orderItemIcon: {
      flexGrow: 1,
      flexShrink: 1,
      cursor: 'pointer',
    },
    icons: {
      height: '0.8em',
      width: '0.8em',
    },
    removeItem: {
      flexShrink: 0,
      flexGrow: 0,
      paddingLeft: theme.spacing(1),
      cursor: 'pointer',

      '&:hover': {
        color: theme.palette.error,
      },
    },
    children: {
      flexGrow: 1,
      flexShrink: 1,
    },
  })
);

const OrderList: FC<OrderListProps> = ({
  data,
  children,
  onMove,
  onDelete,
  ...props
}) => {
  const classes = useStyles({ numberOfItems: data.length });

  const handleOnDragEnd = (result: DropResult) => {
    if (!result) {
      return;
    }

    const { destination, source } = result;

    if (!destination || !source) {
      return;
    }

    onMove(null, source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <List {...props} className={classes.list}>
              {data.map((dataItem: OrderListDataItem, i) => {
                const { id, value } = dataItem;
                // const key = `list-item-${i}`;
                return (
                  <Draggable draggableId={id} index={i} key={id}>
                    {(innerProvided) => (
                      <div
                        ref={innerProvided.innerRef}
                        {...innerProvided.draggableProps}
                        {...innerProvided.dragHandleProps}
                        style={{
                          ...innerProvided.draggableProps.style,
                          padding: '0.25rem 0',
                          marginBottom: '1rem',
                        }}
                      >
                        <span style={{ display: 'none' }}>
                          {provided.placeholder}
                        </span>
                        <ListItem className={classes.listItem}>
                          <Box className={classes.orderItems}>
                            <IconButton
                              onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                              ) => onMove(e, i, i - 1, dataItem)}
                              className={classes.orderItemIcon}
                              disabled={i === 0}
                              size="small"
                            >
                              <ArrowDropUpIcon className={classes.icons} />
                            </IconButton>
                            <IconButton
                              onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                              ) => onMove(e, i, i + 1, dataItem)}
                              className={classes.orderItemIcon}
                              disabled={i === data.length - 1}
                              size="small"
                            >
                              <ArrowDropDownIcon className={classes.icons} />
                            </IconButton>
                          </Box>
                          <Box className={classes.children}>
                            {children(id, value, i, dataItem)}
                          </Box>
                          <Box className={classes.removeItem}>
                            <IconButton
                              onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                              ) => onDelete(e, i, dataItem)}
                              color="secondary"
                            >
                              <DeleteOutline />
                            </IconButton>
                          </Box>
                        </ListItem>
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </List>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default OrderList;
