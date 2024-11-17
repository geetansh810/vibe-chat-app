import React from 'react'

export const index = ({
    children,
}) => {
  return (
          <main className="flex h-[calc(100dvh)] flex-col items-center justify-center gap-4">
              <div className="z-10 border rounded-lg w-full h-full text-sm flex">
                  {/* Page content */}
                  {children}
              </div>
          </main>
  )
}
