"use client"
import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cola from 'cytoscape-cola';
import Cytoscape from "cytoscape";
Cytoscape.use(cola);


export default async function Home() {
  const elements = [
    { data: { id: 'one', label: 'Node 1' } },
    { data: { id: 'two', label: 'Node 2' } },
    { data: { id: 'three', label: 'Node 3' } },
    { data: { id: 'four', label: 'Node 4' } },
    { data: { id: 'five', label: 'Node 5' } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
    { data: { source: 'one', target: 'three', label: 'Edge from Node1 to Node2' } },
    { data: { source: 'one', target: 'four', label: 'Edge from Node1 to Node2' } },
    { data: { source: 'one', target: 'five', label: 'Edge from Node1 to Node2' } }
  ];

  return <div className="min-h-screen w-full flex justify-center items-center">
    <CytoscapeComponent
      elements={elements}
      style={{ width: '100vw', height: '100vh' }}
      stylesheet={[
        {
          selector: 'node',
          style: {
            width: 20,
            height: 20,
            shape: 'circle',
            backgroundColor: '#20222d'
          }
        },
        {
          selector: 'edge',
          style: {
            width: 2,
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