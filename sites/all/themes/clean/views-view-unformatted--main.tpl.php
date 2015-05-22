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
						<div class="proj-desc-body card">
							<h1>DARP</h1>
							<img src="/sites/all/themes/clean/img/front.png" alt="">
						</div>
					</div>
				</div>
			</div>
	</div>	
</div>

<?php foreach ($rows as $id => $row): ?>
	<?php print $row; ?>
<?php endforeach; ?>

<div class="helper">
	<img src="/sites/all/themes/clean/img/keyboard.png">
</div>