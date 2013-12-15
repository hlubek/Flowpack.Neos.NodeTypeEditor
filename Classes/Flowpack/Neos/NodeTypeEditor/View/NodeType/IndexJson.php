<?php
namespace Flowpack\Neos\NodeTypeEditor\View\NodeType;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Flowpack.Neos.NodeTypeEditor".*
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

class IndexJson extends \TYPO3\Flow\Mvc\View\AbstractView {

	/**
	 * @return string
	 */
	public function render() {
		$data = array();
		$nodeTypes = $this->variables['nodeTypes'];
		foreach ($nodeTypes as $nodeTypeName => $nodeType) {
			$data[] = array(
				'name' => $nodeType->getName(),
				'superTypes' => array_map(function($superType) { return $superType->getName(); }, $nodeType->getDeclaredSuperTypes()),
				'configuration' => $nodeType->getFullConfiguration(),
				'abstract' => $nodeType->isAbstract(),
				'final' => $nodeType->isFinal()
			);
		}
		return json_encode(array('nodeTypes' => $data));
	}
}

?>