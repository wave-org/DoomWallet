import React from 'react';

const RootRouteContext = React.createContext({
  rootRoute: '',
  setRootRoute: (_: string) => {},
});

export const RootRouteProvider = ({children}: {children: any}) => {
  const [rootRoute, setRootRoute] = React.useState('');

  return (
    <RootRouteContext.Provider
      value={{
        rootRoute: rootRoute,
        setRootRoute: (route: string) => {
          setRootRoute(route);
        },
      }}>
      {children}
    </RootRouteContext.Provider>
  );
};

export const useRootRoute = () => {
  const {rootRoute, setRootRoute} = React.useContext(RootRouteContext);
  return {rootRoute, setRootRoute};
};
