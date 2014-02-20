var requirePaths = window.T3Configuration.requirejs.paths || {};
requirePaths['Library'] = '../Library';
requirePaths['text'] = '../Library/requirejs/text';
requirePaths['i18n'] = '../Library/requirejs/i18n';

/**
 * WARNING: if changing any of the require() statements below, make sure to also
 * update them inside build.js!
 */
require({
	baseUrl: window.T3Configuration.neosJavascriptBasePath,
	paths: requirePaths,
	locale: 'en'
}, ['emberjs'], function(Ember) {
	window.NodeTypeEditor = Ember.Application.create({rootElement: '#nodetypeeditor'});

	NodeTypeEditor.NodeType = Ember.Object.extend({
		name: null,
		configuration: null,
		abstract: null,
		final: null,
		declaredSuperTypes: null,
		childNodes: null,
		properties: null,

		createChildNodesFromConfiguration: function(childNodesConfiguration) {
			var childNodes = Ember.A();
			if (childNodesConfiguration) {
				$.each(childNodesConfiguration, function(key, data) {
					data.nodePath = key;
					var childNode = NodeTypeEditor.NodeTypeChildNode.create(data);
					childNodes.pushObject(childNode);
				});
			}
			this.set('childNodes', childNodes);
		},

		createPropertiesFromConfiguration: function(propertiesConfiguration) {
			var properties = Ember.A();
			if (propertiesConfiguration) {
				$.each(propertiesConfiguration, function(key, data) {
					data.name = key;
					var property = NodeTypeEditor.NodeTypeProperty.create(data);
					properties.pushObject(property);
				});
			}
			this.set('properties', properties);
		}
	});
	NodeTypeEditor.NodeType.reopenClass({

		/**
		 * Factory method to create a NodeType from the node type raw configuration
		 *
		 * @param {Array} config
		 * @returns {NodeTypeEditor.NodeType}
		 */
		createFromConfiguration: function(config) {
			config = $.extend({}, config);
			var childNodesConfiguration = config.childNodes,
				propertiesConfiguration = config.properties;
			delete config.childNodes;
			delete config.properties;

			var nodeType = NodeTypeEditor.NodeType.create(config);

			nodeType.createChildNodesFromConfiguration(childNodesConfiguration);
			nodeType.createPropertiesFromConfiguration(propertiesConfiguration);

			return nodeType;
		},

		findAll: function() {
			return new Ember.RSVP.Promise(function(resolve, reject) {
				$.getJSON($('#nodetypeeditor').data('nodetypes-uri')).done(function(data) {
					if (data && data.nodeTypes) {
						var nodeTypes = Ember.A();
						$.each(data.nodeTypes, function(nodeTypeName, nodeTypeConfiguration) {
							nodeTypeConfiguration.name = nodeTypeName;
							var nodeType = NodeTypeEditor.NodeType.createFromConfiguration(nodeTypeConfiguration);
							nodeTypes.push(nodeType);
						});
						resolve(nodeTypes);
					} else {
						reject();
					}
				}).fail(function() {
					reject();
				});
			});
		}

	});

	NodeTypeEditor.NodeTypeChildNode = Ember.Object.extend({
		nodePath: null,
		// A ContentCollection is a sane default
		type: 'TYPO3.Neos:ContentCollection'
	});

	NodeTypeEditor.NodeTypeProperty = Ember.Object.extend({
		name: null,
		type: null,
		defaultValue: null,
		ui: null
	});

	NodeTypeEditor.NodeTypesEditController = Ember.ObjectController.extend({
		addSuperType: function() {
			this.get('model.superTypes').pushObject(this.get('newSuperType'));
			this.set('newSuperType', null);
		},
		removeSuperType: function(superType) {
			this.get('model.superTypes').removeObject(superType);
		},

		addChildNode: function() {
			this.get('model.childNodes').pushObject(NodeTypeEditor.NodeTypeChildNode.create({
				nodePath: this.get('newChildNodeNodePath')
			}));
			this.set('newChildNodeNodePath', null);
		},
		removeChildNode: function(childNode) {
			this.get('model.childNodes').removeObject(childNode);
		},

		addProperty: function() {
			this.get('model.properties').pushObject(NodeTypeEditor.NodeTypeProperty.create({
				name: this.get('newPropertyName')
			}));
			this.set('newPropertyName', null);
		},
		removeProperty: function(property) {
			this.get('model.properties').removeObject(property);
		},

		clearTemporaryInput: function() {
			this.set('newChildNodeNodePath', null);
			this.set('newPropertyName', null);
		}
	});

	NodeTypeEditor.NodeTypesRoute = Ember.Route.extend({
		model: function() {
			return NodeTypeEditor.NodeType.findAll();
		}
	});

	NodeTypeEditor.NodeTypesEditRoute = Ember.Route.extend({
		model: function(params) {
			var nodeTypes = this.modelFor('nodeTypes');
			// TODO Clone this model to prevent updates to the list before saving
			return nodeTypes.findBy('name', params.name);
		},
		setupController: function(controller, model) {
			controller.set('model', model);
			controller.clearTemporaryInput();
		}
	});

	NodeTypeEditor.Router.map(function() {
		this.resource('nodeTypes', {path: '/'}, function() {
			this.route('edit', {path: '/:name'});
		});
	});

});
