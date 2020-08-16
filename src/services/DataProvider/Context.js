import React from 'react';
 
const DataProviderContext = React.createContext(null);

export const withDataProvider = Component => props => (
    <DataProviderContext.Consumer>
      {dataProvider => <Component {...props} dataProvider={dataProvider} />}
    </DataProviderContext.Consumer>
  );
 
export default DataProviderContext;