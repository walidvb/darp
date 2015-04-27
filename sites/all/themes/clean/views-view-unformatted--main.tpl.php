<?php
/**
 * @file views-view-unformatted.tpl.php
 * Default simple view template to display a list of rows.
 *
 * @ingroup views_templates
 */
?>
<div class="views-row miniframe" id="intro" data-nid="0" data-title="intro", data-cycle-hash=''>
	<div class="proj-wrapper">
			<div class="proj-description text-slide slide">
				<div class="text-slide-content">
					<div class="proj-desc">
						<div class="proj-desc-body">
							<h1>DARP</h1>
						</div>
					</div>
				</div>
			</div>
	</div>	
</div>

<?php foreach ($rows as $id => $row): ?>
	<?php print $row; ?>
<?php endforeach; ?>

<img src="/sites/all/themes/clean/img/keyboard.png" class="helper">
