<?php
namespace Flowpack\Neos\NodeTypeEditor\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Flowpack.Neos.NodeTypeEditor".*
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Configuration\ConfigurationManager;

class NodeTypeController extends \TYPO3\Flow\Mvc\Controller\ActionController {

	/**
	 * @var \TYPO3\TYPO3CR\Domain\Service\NodeTypeManager
	 * @Flow\Inject
	 */
	protected $nodeTypeManager;

	/**
	 * Get all registered node types
	 *
	 * @return void
	 */
	public function indexAction() {
		$nodeTypes = $this->nodeTypeManager->getNodeTypes(TRUE);
		$this->view->assign('nodeTypes', $nodeTypes);
	}

}

?>