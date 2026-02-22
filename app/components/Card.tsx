"use client";
import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export default function Card({ title, children, action }: Props) {
  return (
    <section className="card" aria-label={title}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span>{action}</span>
      </div>
      <div style={{ marginTop: 8 }}>{children}</div>
    </section>
  );
}
