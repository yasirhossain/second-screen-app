import { forwardRef } from "react";
import cn from "classnames";
import { ListItem, ListItemProps } from "@react-md/list";

import { useKeyboardFocusableElement } from "./KeyboardFocusProvider";

/**
 * @remarks \@since 4.0.0
 */
export interface MenuItemProps extends ListItemProps {
  /**
   * An optional id for the menu item. This is generally recommended, but it can
   * be ignored.
   */
  id?: string;

  /**
   * The current role for the menu item. This will eventually be updated for
   * some of the other `menuitem*` widgets.
   */
  role?: "menuitem" | "button";

  /**
   * The tab index for the menu item. This should always stay at `-1`.
   */
  tabIndex?: number;
}

/**
 * @remarks \@since 4.0.0
 */
export const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(
  function MenuItem(
    { className, children, role = "menuitem", tabIndex = -1, ...props },
    nodeRef
  ) {
    const ref = useKeyboardFocusableElement(nodeRef);
    return (
      <ListItem
        {...props}
        ref={ref}
        role={role}
        tabIndex={tabIndex}
        className={cn("rmd-menu-item", className)}
      >
        {children}
      </ListItem>
    );
  }
);
