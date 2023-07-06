"use client"
import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cola from 'cytoscape-cola';
import Cytoscape from "cytoscape";
Cytoscape.use(cola);


export default async function Home() {
  const elements = [
    { data: { id: 'one', label: 'Node 1', size: 10 } },
    { data: { id: 'two', label: 'Node 2', size: 20 } },
    { data: { id: 'three', label: 'Node 3', size: 30 } },
    { data: { id: 'four', label: 'Node 4', size: 40 } },
    { data: { id: 'five', label: 'Node 5', size: 50 } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2', amount: 1 } },
    { data: { source: 'one', target: 'three', label: 'Edge from Node1 to Node2', amount: 1 } },
    { data: { source: 'one', target: 'four', label: 'Edge from Node1 to Node2', amount: 2 } },
    { data: { source: 'one', target: 'five', label: 'Edge from Node1 to Node2', amount: 1 } },
    { data: { id: 'one1', label: 'Node 1', size: 110 } },
    { data: { id: 'two1', label: 'Node 2', size: 210 } },
    { data: { id: 'five1', label: 'Node 5', size: 510 } },
    { data: { source: 'one', target: 'two1', label: 'Edge from Node1 to Node2', amount: 1 } },
    { data: { source: 'one1', target: 'three', label: 'Edge from Node1 to Node2', amount: 5 } },
    { data: { source: 'one1', target: 'four', label: 'Edge from Node1 to Node2', amount: 2 } },
    { data: { source: 'one', target: 'five1', label: 'Edge from Node1 to Node2', amount: 5 } }
  ];

  return <div className="min-h-screen w-full flex justify-center items-center">
    <CytoscapeComponent
      elements={elements}
      style={{ width: '100vw', height: '100vh' }}
      stylesheet={[
        {
          selector: 'node',
          style: {
            width: 'data(size)',
            height: 'data(size)',
            shape: 'circle',
            backgroundColor: '#20222d'
          }
        },
        {
          selector: 'edge',
          style: {
            width: 'data(amount)',
            lineColor: '#20222d'
          }
        }
      ]}
      layout={{
        name: 'cola',
        infinite: true,
        fit: false
      }}
    />
  </div >
}