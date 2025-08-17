"use client"

import { useQuery, gql } from '@apollo/client'

const TEST_QUERY = gql`
  query TestConnection {
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`

const SCHEMA_QUERY = gql`
  query GetSchema {
    __schema {
      queryType {
        fields {
          name
          type {
            name
            kind
          }
        }
      }
    }
  }
`

export function GraphQLTest() {
  const { data, loading, error } = useQuery(TEST_QUERY)
  const { data: schemaData, loading: schemaLoading, error: schemaError } = useQuery(SCHEMA_QUERY)

  if (loading || schemaLoading) return <div>Testing connection...</div>
  if (error || schemaError) return <div>Error: {(error || schemaError)?.message}</div>

  return (
    <div className="p-4 bg-gray-100 rounded space-y-4">
      <div>
        <h3>GraphQL Connection Test</h3>
        <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
      </div>
      
      <div>
        <h3>Available Query Fields</h3>
        <div className="text-xs">
          {schemaData?.__schema?.queryType?.fields?.map((field: { name: string; type: { name?: string; kind?: string } }) => (
            <div key={field.name} className="mb-1">
              <strong>{field.name}</strong>: {field.type?.name || field.type?.kind}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
