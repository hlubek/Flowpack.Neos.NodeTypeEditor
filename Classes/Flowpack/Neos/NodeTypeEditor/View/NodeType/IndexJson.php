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
		$data = $this->variables['nodeTypes'];
		return json_encode(array('nodeTypes' => $data));
	}
}

?>