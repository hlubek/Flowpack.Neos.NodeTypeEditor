Flowpack.Neos.NodeTypeEditor
============================

A node type editor for TYPO3 Neos (experimental)

Installation
------------

The routes of this package have to be registered in the main `Routes.yaml`::

    ##
    # Package subroutes

    -
      name: 'Node Type Editor'
      uriPattern: 'neos/backend/flowpack/nodetypeeditor/<FlowpackNeosNodeTypeEditorSubroutes>'
      subRoutes:
        'FlowpackNeosNodeTypeEditorSubroutes':
         package: 'Flowpack.Neos.NodeTypeEditor'
