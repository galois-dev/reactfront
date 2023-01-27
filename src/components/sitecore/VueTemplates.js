import * as React from "react";

const If = ({ condition, children }) => {
  if (condition) {
    return children;
  }
  return <></>;
};

const Else = ({ children }) => children;

const Elif = ({ condition, children }) => {
  if (condition) {
    return children[0];
  }
  return children[1];
};

const IfElse = ({ condition, children }) => {
  if (condition) {
    return children[0];
  }
  return children[1];
};

const Condition = ({ children }) => {
  const childrenArray = React.Children.toArray(children);
  childrenArray.forEach((child, index) => {
    if (child.type === If) {
      if (child.props.condition) {
        return child.props.children;
      }
    } else if (child.type === Elif) {
      if (child.props.condition) {
        return child.props.children[index];
      }
      return child.props.children[index + 1];
    } else if (child.type === IfElse) {
      if (child.props.condition) {
        return child.props.children[index];
      }
      return child.props.children[index + 1];
    } else if (child.type === Else) {
      return child.props.children;
    }
  });
  return <></>;
};

const List = ({ list, component }) => {
  const Component = component;
  return (
    <React.Fragment>
      {list.map((item, index) => (
        <Component key={index} item={item} />
      ))}
    </React.Fragment>
  );
};
