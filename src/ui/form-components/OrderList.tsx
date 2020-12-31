import React, { FC, ReactNode } from 'react';

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
  label: string;
  value?: string;
  data?: OrderListDataItemDataProp;
};

export type OrderListData = Array<OrderListDataItem>;

type ActionHandler = (
  e: React.MouseEvent<HTMLButtonElement>,
  data: OrderListData
) => void;

// interface OrderListBaseProps extends ;
type OrderListBaseProps = Pick<ListProps, Exclude<keyof ListProps, 'onChange'>>;

interface OrderListProps extends OrderListBaseProps {
  data: OrderListData;
  children: (
    id: ID,
    label: string,
    i: number,
    attrs: OrderListDataItem
  ) => ReactNode;
  onChange?: ActionHandler; // override default onChange
}

const useStyles = makeStyles((theme) =>
  createStyles({
    listItem: {
      display: 'flex',
      flexFlow: 'row',
      padding: 0,
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
  onChange,
  ...props
}) => {
  const classes = useStyles();

  /**
   * callback to handle reorder items
   * @param i
   * @param direction
   * @param e
   */
  const handleReOrder = (
    e: React.MouseEvent<HTMLButtonElement>,
    i: number,
    direction: ReOrderDirection
  ) => {
    // stop if no reorder callback present
    if (!onChange) return false;

    const newData = [...data];

    if (direction === ReOrderDirection.UP) {
      [newData[i - 1], newData[i]] = [newData[i], newData[i - 1]];
    } else {
      [newData[i], newData[i + 1]] = [newData[i + 1], newData[i]];
    }

    onChange(e, newData);

    return newData;
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>, i: number) => {
    if (!onChange) return false;

    const newData = [...data];
    newData.splice(i, 1);

    onChange(e, newData);

    return newData;
  };

  return (
    <List {...props}>
      {data.map((dataItem: OrderListDataItem, i) => {
        const { id, label } = dataItem;
        const key = `list-item-${i}`;
        return (
          <ListItem className={classes.listItem} key={key}>
            <Box className={classes.orderItems}>
              <IconButton
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  handleReOrder(e, i, ReOrderDirection.UP)
                }
                className={classes.orderItemIcon}
                disabled={i === 0}
                size="small"
              >
                <ArrowDropUpIcon />
              </IconButton>
              <IconButton
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  handleReOrder(e, i, ReOrderDirection.DOWN)
                }
                className={classes.orderItemIcon}
                disabled={i === data.length - 1}
                size="small"
              >
                <ArrowDropDownIcon />
              </IconButton>
            </Box>
            <Box className={classes.children}>
              {children(id, label, i, dataItem)}
            </Box>
            <Box className={classes.removeItem}>
              <IconButton
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  handleRemove(e, i)
                }
                color="secondary"
              >
                <DeleteOutline />
              </IconButton>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
};

export default OrderList;
